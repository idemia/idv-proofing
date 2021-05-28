import get from 'lodash/get';

export function handleExternalApiResponse(target, name, descriptor) {
  const originalFunction = descriptor.value;
  descriptor.value = async function (...args) {
    try {
      const response = await originalFunction.apply(this, args);
      return {
        status: 'success',
        data: get(response, 'data'),
      };
    } catch (error) {
      return {
        status: 'error',
        data: get(error, 'response.data'),
      };
    }
  };
}
