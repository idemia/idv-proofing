export const mergeMethods = arrayOfMethods => {
  let documentInfo = {};
  let identity = {};
  if (!arrayOfMethods) return { documentInfo, identity };

  arrayOfMethods.forEach(method => {
    documentInfo = { ...documentInfo, ...(method?.result?.documentInfo || {}) };
    identity = { ...identity, ...(method?.result?.identity || {}) };
  });

  return { documentInfo, identity };
};
