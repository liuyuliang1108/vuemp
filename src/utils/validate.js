/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  //const valid_map = ['admin', 'editor']
  if (str.length>2&&str.length<20) {
    return true
  }else {
    return false
  }
  // return valid_map.indexOf(str.trim()) >= 0
}
