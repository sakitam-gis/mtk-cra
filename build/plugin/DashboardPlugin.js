const path = require('path')
const fs = require('fs-extra')
const webpack = require('webpack')
const { IpcMessenger } = require('../utils/ipc')
const { analyzeBundle } = require('./analyzeBundle')

const ID = 'webpack-dashboard'
const ONE_SECOND = 1000
const FILENAME_QUERY_REGEXP = /\?.*$/

const ipc = new IpcMessenger()

function getTimeMessage (timer) {
  let time = Date.now() - timer

  if (time >= ONE_SECOND) {
    time /= ONE_SECOND
    time = Math.round(time)
    time += 's'
  } else {
    time += 'ms'
  }

  return ` (${time})`
}

// Naive camel-casing.
const camel = str => str.replace(/-([a-z])/, group => group[1].toUpperCase());

// Normalize webpack3 vs. 4 API differences.
function _webpackHook(hookType, compiler, event, callback) {
  if (compiler.hooks) {
    hookType = hookType || "tap";
    compiler.hooks[camel(event)][hookType]("webpack-dashboard", callback);
  } else {
    compiler.plugin(event, callback);
  }
}

const webpackHook = _webpackHook.bind(null, "tap");
const webpackAsyncHook = _webpackHook.bind(null, "tapAsync");

class DashboardPlugin {
  constructor (options) {
    this.type = options.type
    if (this.type === 'build' && options.modernBuild) {
      this.type = 'build-modern'
    }
    this.watching = false
    this.autoDisconnect = !options.keepAlive
  }

  cleanup () {
    this.sendData = null
    if (this.autoDisconnect) ipc.disconnect()
  }

  apply (compiler) {
    let sendData = this.sendData
    let timer

    let assetSources = new Map()

    if (!sendData) {
      sendData = data => ipc.send({
        webpackDashboardData: {
          type: this.type,
          value: data
        }
      })
    }

    // Progress status
    let progressTime = Date.now()
    const progressPlugin = new webpack.ProgressPlugin((percent, msg) => {
      // Debouncing
      const time = Date.now()
      if (time - progressTime > 300) {
        progressTime = time
        sendData([
          {
            type: 'status',
            value: 'Compiling'
          },
          {
            type: 'progress',
            value: percent
          },
          {
            type: 'operations',
            value: msg + getTimeMessage(timer)
          }
        ])
      }
    })
    progressPlugin.apply(compiler)

    webpackAsyncHook(compiler, "watch-run", (c, done) => {
      this.watching = true;
      done();
    });

    webpackAsyncHook(compiler, "run", (c, done) => {
      this.watching = false;
      done();
    });

    webpackHook(compiler, "compile", () => {
      timer = Date.now()

      sendData([
        {
          type: 'status',
          value: 'Compiling'
        },
        {
          type: 'progress',
          value: 0
        }
      ])
    })

    webpackHook(compiler, "invalid", () => {
      sendData([
        {
          type: 'status',
          value: 'Invalidated'
        },
        {
          type: 'progress',
          value: 0
        },
        {
          type: 'operations',
          value: 'idle'
        }
      ])
    })

    webpackHook(compiler, "failed", () => {
      sendData([
        {
          type: 'status',
          value: 'Failed'
        },
        {
          type: 'operations',
          value: `idle${getTimeMessage(timer)}`
        }
      ])
    })

    compiler.hooks.afterEmit.tap(ID, compilation => {
      assetSources = new Map()
      for (const name in compilation.assets) {
        const asset = compilation.assets[name]
        assetSources.set(name.replace(FILENAME_QUERY_REGEXP, ''), asset.source())
      }
    })

    compiler.hooks.done.tap(ID, stats => {
      let statsData = stats.toJson()
      // Sometimes all the information is located in `children` array
      if ((!statsData.assets || !statsData.assets.length) && statsData.children && statsData.children.length) {
        statsData = statsData.children[0]
      }

      const outputPath = compiler.options.output.path
      statsData.assets.forEach(asset => {
        // Removing query part from filename (yes, somebody uses it for some reason and Webpack supports it)
        asset.name = asset.name.replace(FILENAME_QUERY_REGEXP, '')
        asset.fullPath = path.join(outputPath, asset.name)
      })
      // Analyze the assets and update sizes on assets and modules
      analyzeBundle(statsData, assetSources)

      const hasErrors = stats.hasErrors()

      sendData([
        {
          type: 'status',
          value: hasErrors ? 'Failed' : 'Success'
        },
        {
          type: 'progress',
          value: 1
        },
        {
          type: 'operations',
          value: `idle${getTimeMessage(timer)}`
        }
      ])

      const statsFile = path.resolve(process.cwd(), `./node_modules/.stats-${this.type}.json`)
      fs.writeJson(statsFile, {
        errors: hasErrors,
        warnings: stats.hasWarnings(),
        data: statsData
      }).then(() => {
        sendData([
          {
            type: 'stats'
          }
        ])

        if (!this.watching) {
          this.cleanup()
        }
      }).catch(error => {
        console.error(error)
      })
    })
  }
}

module.exports = DashboardPlugin
