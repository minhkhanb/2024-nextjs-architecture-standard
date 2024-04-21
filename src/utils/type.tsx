export function withProperties<A, B>(component: A, properties: B): A & B {
  if (properties instanceof Object) {
    Object.keys(properties).forEach((key) => {
      (component as Record<string, unknown>)[key] = (
        properties as Record<string, unknown>
      )[key];
    });
  }

  return component as A & B;
}

export const enumValuesToArray = (
  enumObject: Record<string, string>,
  propValue = 'value',
  subProp = 'label'
): { [key: string]: string }[] =>
  Object.values(enumObject).map((val: string) => ({
    [propValue]: val,
    [subProp]: val,
  }));
