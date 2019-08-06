# javascript 正则表达式

## 前言

日常在使用JS的正则表达式时，总是有很多方面的参数或者语法记不清楚。现在通过分类整理，来强化自己对其的记忆和理解。

## JS正则的基本语法

1. 简单的正则语法
   `/正则表达式主体/修饰符(可选)`
   > `var regex = /xyz/i;`
2. 使用`RegExp`对象进行创建正则
   `new RegExp('正则表达式主体', '修饰符')`
   > `var regex = new RegExp('xyz', 'i');`

其中，修饰符的列表如下：
|修饰符|作用|
|----|:----:|----:|
|i|匹配时，大小写不敏感|
|g|执行全局匹配，会查找所有匹配因素|
|m|执行多行匹配|
|u (es6新增)|“Unicode 模式”，用来正确处理大于\uFFFF的，四个字节的 Unicode 字符|
|y (es6新增)|'粘连'修饰符，类似于'g'，不过其下次的匹配必须从前一次匹配的末尾进行|

## 正则表达式规则概述

### 元字符
|元字符|描述|
|----|:----:|
|.|任意一个字符，除了换行符（\n）以外|
|^| 以某个字符开始|
|$|以某个字符结尾|
|\\|转义字符|
|\w|匹配一个 0-9、a-z、A-Z、_ 的数字或字符,相当于[0-9a-zA-Z_]. 其反义元字符为：\W|
|\s|匹配空白字符（空格、制表符、换行符...）。 其反义为： \S|
|\t|匹配制表符|
|\n|匹配换行符|
|\d|匹配数字，相当于[0-9]。其反义为：\D|
|\0|匹配NULL字符|
|\||or选项，（x\|y）表示匹配x或者y|
|[]|任一选择，[xyz]表示x,y,z中的任意一个。[^xyz]表示除了x,y,z中的任一字符|
|-|范围标识符，[a-z]表示a-z中的任意一个字符。[^a-z]表示除了a-z之外的任意一个字符|
|()|正则中的分组|

### 量词元字符
|元字符|描述|
|----|:----:|
|?|出现0次或1次|
|+|出现1次或多次|
|*|出现0次到多次|
|{n}|出现n次|
|{n,}|出现n次到多次|
|{n,m}|出现n次到m次|

## JS正则的表达式方法

1.  `exec`方法，表示在字符串中查找匹配的 **RegExp** 方法，返回一个数组（未匹配到则返回null）。需要注意的式，它每次执行只会返回已找到的匹配，如果想要继续查找，需要继续执行。
   ```javascript
    let myRe = /l\d+l/g
    myRe.exec('lol is very good l1l l2l i3l ll')
    // 结果为 ["l1l", index: 17,....] 的数组

    //再次执行
    myRe.exec('lol is very good l1l l2l i3l ll')
    // 结果为 ["l2l", index: 21,...] 的数组
   ```
2.  `test`方法，表示一个在字符串中测试是否匹配的 **RegExp** 方法，它返回true或false。
   ```javascript
    let myRe = /l\d+l/g
    myRe.test('lol is very good l1l l2l i3l ll')
    // 结果为 true
   ```
3.  `match`一个在字符串中执行查找匹配的 **String** 方法，它返回一个数组或者在未匹配到时返回null。
   ```javascript
    let myRe = /l\d+l/g
    'lol is very good l1l l2l i3l ll'.match(myRe)
    // 结果为 ["l1l", "l2l"]

    'hello world'.match(myRe)
    // 结果为 null
   ```
4.  `search`一个在字符串中测试匹配的 **String** 方法，它返回匹配到的位置索引，或者在失败时返回-1。需要注意的式，search只会寻找到第一个匹配的index值。
   ```javascript
    let myRe = /l\d+l/g
    'lol is very good l1l l2l i3l ll'.search(myRe)
    // 结果为 17

    'hello world'.search(myRe)
    // 结果为 -1
   ```
5.  `replace`一个在字符串中执行查找匹配的 **String** 方法，并且使用替换字符串替换掉匹配到的子字符串。
   ```javascript
    let myRe = /l\d+l/g
    'lol is very good l1l l2l i3l ll'.replace(myRe, '😀')
    // 结果为 "lol is very good 😀 😀 i3l ll"

    'hello world'.replace(myRe, '😀')
    // 结果为 'hello world'
   ```
6. `split`一个使用正则表达式或者一个固定字符串分隔一个字符串，并将分隔后的子字符串存储到数组中的 **String** 方法.
   ```javascript
    let myRe = /l\d+l/g
    'lol is very good l1l l2l i3l ll'.split(myRe)
    // 结果为  ["lol is very good ", " ", " i3l ll"]
   ```

## 正则的分组
1. 使用括号进行简单分组（捕获型分组）
   ```javascript
    var regex = /(\d{4})-(\d{2})-(\d{2})/;
    var string = "2017-06-12";
    let matchArr = string.match(regex) // 此方法等同于 regex.exec(string)
    // matchArr = ["2017-06-12", "2017", "06", "12",...]
    // 此时可以根据 数组的下标进行获取。
   ```
   可以通过RegExp对象的方式进行分组的获取
   ```javascript
    var regex = /(\d{4})-(\d{2})-(\d{2})/;
    var string = "2017-06-12";

    regex.test(string); // 正则操作即可，例如
    //regex.exec(string);
    //string.match(regex);

    console.log(RegExp.$1); // "2017"
    console.log(RegExp.$2); // "06"
    console.log(RegExp.$3); // "12"
   ```
   下面是一个简单的例子,把yyyy-mm-dd格式，替换成mm/dd/yyyy：
   ```javascript
    var regex = /(\d{4})-(\d{2})-(\d{2})/;
    var string = "2017-06-12";
    var result = string.replace(regex, "$2/$3/$1");
    console.log(result); 
    // => "06/12/2017"

    // 以下代码效果相同
    var regex = /(\d{4})-(\d{2})-(\d{2})/;
    var string = "2017-06-12";
    var result = string.replace(regex, function() {
        return RegExp.$2 + "/" + RegExp.$3 + "/" + RegExp.$1;
    });
    console.log(result); 
    // => "06/12/2017"
   ```
2. 非捕获型分组  
   如果我们只是想简单的进行分组，而没有捕获的需求， 使用 `?:` 来表示：
   ```javascript
    let regex = /(?:\d{4}-(\d{2})-(\d{2}))/
    let str = '2019-03-01'
    regex.test(str) // true

    console.log(RegExp.$1) // '03'
    //即，第一个括号内不会进行捕获，所以第一个为 03
   ```
3. 反向引用。  
   
   反向引用是通过`\1`、`\2`、`\3`...等反义+数字的方式，对之前已经分组的信息进行再引用。

   比如，匹配以下日期：
   > 2019-03-01  
   2019.03.01  
   2019/03/01

   正常方法匹配时，可能会使用如下正则进行匹配：
   ```javascript
    let regex = /\d{4}(-|\.|\/)\d{2}(-|\.|\/)d{2}/
    let str1 = '2019-03-01'
    let str2 = '2019.03.01'
    let str3 = '2019/03/01'
    let str4 = '2019-03/01'
    console.log(regex.test(str1)) // true
    console.log(regex.test(str2)) // true
    console.log(regex.test(str3)) // true
    console.log(regex.test(str4)) // true

    //即，虽然可以正确匹配以上时间格式，但是像 2019-03/01 这种格式也会匹配。
   ```
   如果，需要前后一致的进行匹配，可以使用反向引用。
   ```javascript
    let regex = /\d{4}(-|\.|\/)\d{2}\1\d{2}/
    // \1 表示前一个匹配的分组结果
    let str1 = '2019-03-01'
    let str2 = '2019.03.01'
    let str3 = '2019/03/01'
    let str4 = '2019-03/01'
    console.log(regex.test(str1)) // true
    console.log(regex.test(str2)) // true
    console.log(regex.test(str3)) // true
    console.log(regex.test(str4)) // false
   ```
   需要注意的几点：
   > 括号嵌套，以左括号为准。
    ```javascript
    var regex = /^((\d)(\d(\d)))\1\2\3\4$/;
    var string = "1231231233";
    console.log( regex.test(string) ); // true
    console.log( RegExp.$1 ); // 123
    console.log( RegExp.$2 ); // 1
    console.log( RegExp.$3 ); // 23
    console.log( RegExp.$4 ); // 3

    /**
     * 左侧为三个数字，即匹配的为123
     * \1 对应第一个括号，匹配的为 123
     * \2 对应第二个括号，匹配的数字为 1
     * \3 对应第三个括号，匹配数字为 23
     * \4 对应第四个括号，匹配数字为 3
     * 
     * 即，'1231231233'可以匹配成功。
     */
    ```
   > \10 应该匹配为 \10 而不是 \1和0。
    ```javascript
    var regex = /(1)(2)(3)(4)(5)(6)(7)(8)(9)(#) \10+/;
    var string = "123456789# ######"
    console.log( regex.test(string) );
    // => true
    ```
   > 引用不存在的分组，则 \1 会被匹配为数字的反义引用。即，\1 的转义。
    ```javascript
    var regex = /\1\2\3\4\5\6\7\8\9/;
    console.log( regex.test("\1\2\3\4\5\6\7\8\9") ); 
    console.log( "\1\2\3\4\5\6\7\8\9".split("") );
    ```
4. 命名分组  
   可以通过在括号内加入命名标识的方式，进行分组命名。之后可以通过名称进行分组的获取。
   ```javascript
    let regex = /(?<year>\d{4})(-|\.|\/)(?<month>\d{2})\2(?<day>\d{2})/
    let str = '2019-03-01'
    let matchObj = str.match(regex) 
    // ["2019-03-01", "2019", "-", "03", "01",... groups: {…}]

    const year = matchObj.groups.year // 2019
    const month = matchObj.groups.month // 03
    const day = matchObj.groups.day // 01
   ```