// import get from 'lodash/get';
// import find from 'lodash/find';
// import sample from 'lodash/sample';
// import request from '@/utils/request';
import { createDB } from '@/utils/indexedDB';
import dayjs, { mockDataTime } from '@/utils/dayjs';
// import { get as idbGet, set as idbSet } from 'idb-keyval';

const CUSTOM_IDB = 'idb';

const colors = [];

for (let r = 15; r <= 255; r += 30)
  for (let g = 15; g <= 255; g += 30)
    for (let b = 15; b <= 255; b += 30) colors.push([r, g, b]);

console.log(colors.length);

export async function getDataList () {
  let startTime = dayjs();
  const h = startTime.hour();
  const relh = h - (h % 6);
  startTime = startTime.hour(relh);
  const endTime = startTime.add(7, 'd');
  const lists = mockDataTime(startTime, endTime, {
    interval: 6 * 10 * 3,
    paddingRight: true,
    paddingLeft: true,
  });
  return lists;
}

function getSymbol(col, row) {
  let len = colors.length;
  let color = colors[Math.round(Math.random() * (len - 1))];
  return {
    lineWidth: 0,
    lineColor : '#000',
    lineOpacity : 0,
    polygonFill : 'rgb(' + color.join() + ')',
    polygonOpacity : 0.4
  };
}

function randomData () {
  const data = [];
  for (let i = -150; i < 150; i++ ){
    for (let ii = -150; ii < 150; ii++) {
      data.push([i, ii, { symbol: getSymbol(i, ii)}]);
    }
  }
  return {
    projection: true,
    center: [104.21, 36.42],
    width: 2000,
    height: 2000,
    data: data,
  };
}

export async function getData(id) {
  const db = await createDB('mtk-cra');
  let data = await db.get(CUSTOM_IDB, id);
  if (!data) {
    data = randomData();
    await addItem(id, data);
  }
  return {
    code: 200,
    data,
    msg: 'success',
  };
}

export async function deleteItem (id) {
  const db = await createDB('mtk-cra');
  await db.delete(CUSTOM_IDB, id)
  return {
    code: 200,
    data: true,
    msg: 'success',
  };
}

export async function addItem (id, params) {
  const db = await createDB('mtk-cra');
  await db.put(CUSTOM_IDB, params, id);
  const list = await db.getAll(CUSTOM_IDB);

  return {
    code: 200,
    data: list,
    msg: 'success',
  };
}

export async function cacheData () {

}
