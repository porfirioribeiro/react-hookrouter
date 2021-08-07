export type PathToRe = [RegExp, string[], string];

const cachedPaths: Record<string, PathToRe> = {};

const propRE = /:\w+/g;

export function pathToRe(path: string): PathToRe {
  if (!cachedPaths[path]) {
    const wcEnd = path.substr(-1) === '*';
    const prefix = path.substr(0, 1) === '*' ? '' : '^';
    const uri = path.replace(propRE, '([^/]+)').replace(/\*/g, '');
    const re = new RegExp(`${prefix}(${uri})${wcEnd ? `(.*)` : `$`}`);

    const match = path.match(propRE);
    const props = match ? match.map((p: string) => p.substr(1)) : [];
    if (wcEnd) props.push('$');
    const basePath = wcEnd ? path.slice(0, -1) : path;

    cachedPaths[path] = [re, props, basePath];
  }

  return cachedPaths[path];
}
