# 巧用异步事件队列.

## Q: 如果数组列表太大，以下递归代码将导致堆栈溢出。你如何解决这个问题，仍然保留递归模式

```javascript
let list = readHugeList();
let nextListItem = function() {
    let item = list.pop();
    if (item) {
        // process the list item...
        nextListItem();
    }
};
```

## A: 堆栈溢出被消除，因为事件循环处理递归，而不是调用堆栈。当nextListItem运行时，如果item不为null，则将超时函数（nextListItem）推送到事件队列，并且函数退出，从而使调用堆栈清零。当事件队列运行超时事件时，将处理下一个项目，并设置一个计时器以再次调用nextListItem。因此，该方法从头到尾不经过直接递归调用即可处理，因此调用堆栈保持清晰，无论迭代次数如何。

## 简而言之就是,函数之行到 timeout 时, 将 nextListItem 放入宏任务队列(原本应该是递归操作), 利用时间循环处理, 然后继续之行之后的代码. 在执行结束之后, 将结束该函数的函数栈. 主栈空了空了之后, 进入宏任务队列, 由时间循环机制处理刚刚放入的 nextListItem . 如此一来, 就没有嵌套函数栈了.

```javascript
let list = readHugeList();
let nextListItem = function() {
    let item = list.pop();
    if (item) {
        // process the list item...
        setTimeout(nextListItem, 0);
    }
};
```