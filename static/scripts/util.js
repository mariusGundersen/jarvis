export function template(strings, ...objects) {
  return String.raw(strings, ...objects.map(o => Array.isArray(o) ? o.join('') : o))
}

export function post(path) {
  return fetch(path, {
    method: 'POST'
  });
}

export function getJson(path) {
  return fetch(path).then(r => r.json());
}

export async function delay(ms, setToken = () => { }) {
  return new Promise(res => {
    const timeout = setTimeout(res, ms);
    setToken(() => clearTimeout(timeout));
  });
}
