/**
 * Created by HOFFM59 on 03.05.2017.
 */
export const getChildByName = (node: Node, name: string): Node => {
  const filteredChildren = Array.from(node.childNodes).filter(child => child.nodeName === name && child.nodeType === Node.ELEMENT_NODE);
  return filteredChildren.length ? filteredChildren[0] : null;
};

export const getChildrenByName = (node: Node, name: string): Array<Node> => {
  return Array.from(node.childNodes).filter(child => child.nodeName === name && child.nodeType === Node.ELEMENT_NODE);
};

export const childWithNameExists = (node: Node, name: string): boolean => {
  const filteredChildren = Array.from(node.childNodes).filter(child => child.nodeName === name && child.nodeType === Node.ELEMENT_NODE);
  return !!filteredChildren.length;
};

export const getText = (node: Node, name: string): string => {
  let text = '';

  if (childWithNameExists(node, name)) {
    text = getChildrenByName(node, name).map(child => child.textContent).join('\n');
  }

  return text;
};

export const getTextArray = (node: Node, name: string): Array<string> => {
  let text: Array<string> = [];

  if (childWithNameExists(node, name)) {
    text = getChildrenByName(node, name).map(child => child.textContent);
  }

  return text;
};

export const getNumber = (node: Node, name: string): number => {
  let result = NaN;

  if (childWithNameExists(node, name)) {
    result = parseFloat(getChildByName(node, name).textContent);
  }

  return result;
};

export const getAttributeByName = (node: Node, name: string): Attr => {
  const filteredAttributes = Array.from(node.attributes).filter(a => a.name === name);
  return filteredAttributes.length ? filteredAttributes[0] : null;
};
