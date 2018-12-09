/**
 * 给定两个非空链表来表示两个非负整数。 位数按照逆序方式存储， 它们的每个节点只存储单个数字。 将两数相加返回一个新的链表。

 你可以假设除了数字 0 之外， 这两个数字都不会以零开头。

 示例：

 输入：(2 - > 4 - > 3) + (5 - > 6 - > 4)
 输出： 7 - > 0 - > 8
 原因： 342 + 465 = 807
 */

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
function ListNode(val, next = null) {
    this.val = val;
    this.next = next;
}

const genNumLi = (num) => {
    if (num <= 0) {
        return null
    }
    const curNum = num % 10;
    const root = new ListNode(curNum);
    num = Math.floor(num / 10);

    let cur = root;
    while (num > 0) {
        const curNum = num % 10;
        cur.next = new ListNode(curNum);

        num = Math.floor(num / 10);
        cur = cur.next;
    }

    return root;
}

const [l1, l2] = [
    genNumLi(99),
    genNumLi(10),
];  // 1245


function addTwoNumbers(l1, l2) {
    let overflow = false;
    let cur1 = l1;
    let cur2 = l2;

    let temp = true
    while (cur1 !== null || cur2 !== null) {
        const sum = cur1.val + cur2.val + !!overflow;
        overflow = sum >= 10;
        cur1.val = sum % 10;
        cur2.val = sum % 10;

        // 如果不够进行补位
        temp = cur1.next || cur2.next;
        cur1 = cur1.next || (temp || overflow ? cur1.next = {val: 0} : null);
        cur2 = cur2.next || (temp || overflow ? cur2.next = {val: 0} : null);
    }

    return cur1 && l1 || cur2 && l2 || l1;
}



const li = addTwoNumbers(l1, l2);

console.log(JSON.stringify(li));


/**
 * lee 耗时最少解法
 */
function addTwoNumbers(l1, l2) {
    let carry = 0;
    let result = new ListNode();
    let resultNode = result;
    let l1val = l1.val;
    let l2val = l2.val;
    while (l1 || l2 || carry > 0) {
        l1val = l1 ? l1.val : 0;
        l2val = l2 ? l2.val : 0;
        resultNode.val = l1val + l2val + carry;
        carry = 0;
        if (resultNode.val >= 10) {
            resultNode.val = resultNode.val % 10;
            carry = 1;
        }
        l1 && (l1 = l1.next);
        l2 && (l2 = l2.next);
        if (l1 || l2 || carry > 0) {
            resultNode.next = new ListNode();
            resultNode = resultNode.next;
        }
    }
    return result;
}
