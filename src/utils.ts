export function segmentize(uri: string) {
  return (
    uri
      // strip starting/ending slashes
      .replace(/(^\/+|\/+$)/g, '')
      .split('/')
  );
}

export const urlSplitRE = /([^?#]*)(\?[^#]*)?(#.*)?/;
