function createCallback(opts = {}) {
  const { only = [], except = [] } = opts;
  if (only.length > 0 && except.length > 0) {
    throw Error(
      'It is ambiguous to configurate `only` and `except` items at the same time.',
    );
  }

  // eslint-disable-next-line no-unused-vars
  function onEffect(effect, { _ }, model, actionType) {
    if (
      (only.length === 0 && except.length === 0) ||
      (only.length > 0 && only.indexOf(actionType) !== -1) ||
      (except.length > 0 && except.indexOf(actionType) === -1)
    ) {
      return function* (...args) {
        const params = [];
        args.forEach(arg => {
          params.push({
            callback: () => undefined,
            ...arg,
          });
        });
        yield effect(...params);
      };
    }
    return effect;
  }

  return {
    onEffect,
  };
}

export default createCallback;
