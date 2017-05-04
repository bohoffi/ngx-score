/**
 * Created by HOFFM59 on 03.05.2017.
 */

export const xmlToObject = (node: Node): any => {

  const object: any = {};

  if (node.nodeType === Node.ELEMENT_NODE) {

    if (node.hasAttributes()) {
      object['attributes'] = Array.from(node.attributes)
        .reduce((map, attr) => {
          map.set(attr.nodeName, attr.nodeValue);
          return map;
        }, new Map());
    }

    if (node.hasChildNodes()) {

      if (node.childNodes.length === 1 && node.childNodes.item(0).nodeType === Node.TEXT_NODE) {
        return node.childNodes.item(0).textContent;
      } else {
        Array.from(node.childNodes).filter(child => child.nodeType === Node.ELEMENT_NODE).forEach(child => {
          const nodeName = child.nodeName;

          if (!object.hasOwnProperty(nodeName)) {
            object[nodeName] = xmlToObject(child);
          } else {
            if (!(object[nodeName] instanceof Array)) {
              const old = object[nodeName];
              object[nodeName] = [];
              object[nodeName].push(old);
            }
            object[nodeName].push(xmlToObject(child));
          }
        });
      }
    }
  }

  return object;
};
