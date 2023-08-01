const element = document.documentElement; // 或者任何其他元素

export const style = getComputedStyle(element);

/**
 * 获取全局Style参数
 * @param property 参数名称（--name）
 * @param original 是否获取原始string数据
 * @returns 
 */
export const useStyleProperty = (property: string, original: boolean = false) => {
    const value = style.getPropertyValue(property).trim();
    if(original){
        return value
    }
    return parseFloat(value)
}