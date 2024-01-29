export const swapArrayElements = function <T>(arr: Array<T>, index: number) {
    if (index < 0 || index >= arr.length) {
      console.error("Invalid index");
      return arr;
    }
  
    const firstPart = arr.slice(0, index);
    const secondPart = arr.slice(index);
    
    return secondPart.concat(firstPart);
  }