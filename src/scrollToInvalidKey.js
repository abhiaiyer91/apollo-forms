import { isUndefined, get, isFunction } from 'lodash';
import smoothscroll from 'smoothscroll';

function offset(el) {
  if (!el || !isFunction(el && el.getBoundingClientRect)) {
    return {
      top: 0,
      left: 0,
    };
  }

  const rect = el.getBoundingClientRect();
  const top = get(rect, 'top');
  const left = get(rect, 'left');
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return { top: top + scrollTop, left: left + scrollLeft };
}

/**
 * Scroll to the field name that is invalid
 * @param keyName
 * @returns {*}
 */
export default function scrollToInvalidKey(keyName) {
  const VALIDATION_SCROLL_OFFSET = 150;
  const labelSelector = document.querySelector(`label[for="${keyName}"]`);
  const invalidKeyScrollTop = get(offset(labelSelector), 'top');
  if (isUndefined(invalidKeyScrollTop)) {
    return;
  }
  const scrollTop = invalidKeyScrollTop - VALIDATION_SCROLL_OFFSET;
  return smoothscroll(scrollTop);
}
