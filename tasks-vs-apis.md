# Task and APIs

## attaching event handlers 

### ES

Use [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

```javascript
var el = document.getElementById("outside");
el.addEventListener("click", modifyText, false);
```

### AngularJS

ng-click, ng-dblclick, ng-change, ng-select, ... [Doc](https://docs.angularjs.org/api/ng/directive/ngClick)


## URL building 

### ES

Use [encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
```
function encodeData(data) {
    return Object.keys(data).map(function(key) {
        return [key, data[key]].map(encodeURIComponent).join("=");
    }).join("&");
}   
```
### AngularJS

Use [$httpParamSerializer](https://docs.angularjs.org/api/ng/service/$httpParamSerializer)


## String templating

### ES

Use backtick \` \` and \{ \}
Eg: \`This is template string with embeded var is \{var\}\`

### AngularJS

Use [$interpoilate](https://docs.angularjs.org/api/ng/service/$interpolate)
```JAVASCRIPT
var context = {greeting: 'Hello', name: undefined };
$interpolate('{{greeting}} {{name}}!'); //Hello !
```

## Looking up element

### ES

```javascript
document.getElementById('id'); return only element by id
document.getElementByClassName('class');
document.querySelector('.class'); // return the 1st elementfound
document.querySelectorAll('#id .class'); // return the list of element found
```

### AngularJS

Use `element.find`, inject the `element` into Controller or Directive (*recommended*).
Angular uses jsLite to retrieve and manipulate DOM with XB compatibility
[element](https://docs.angularjs.org/api/ng/function/angular.element)

## Iterate, loop

### ES

From ES6
Use [`for...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of)

```javascript
let iterable = [10, 20, 30];

for (let value of iterable) {
  console.log(value);
}
// 10
// 20
// 30
```

Use `for`

```javascript
for (var i = 0; i < 9; i++) {
   console.log(i);
   // more statements
}

```
Use `for...in` for enumarable properties of an object
```javascript
var obj = {a:1, b:2, c:3};
    
for (var prop in obj) {
  console.log("obj." + prop + " = " + obj[prop]);
}

// Output:
// "obj.a = 1"
// "obj.b = 2"
// "obj.c = 3"
```

Use Array method:
	filter: returns an array of items that satisfy some condition or test.
	every: returns true if every array member passes the test.
	some: returns true if any pass the test.
	forEach: runs a function on each array member and doesn't return anything.
	map: is like forEach, but it returns an array of the results of the operation for each element.

Interesting disscusion on [StackOverflow](http://stackoverflow.com/questions/3010840/loop-through-an-array-in-javascript)

### AngularJS

Use [angular.forEach](https://docs.angularjs.org/api/ng/function/angular.forEach)
which can be either an object or an array
```javascript
var values = {name: 'misko', gender: 'male'};
var newArray = [];
angular.forEach(values, function(value, key) {
  this.push(key + ': ' + value);
}, newArray);
```

## Mixing object

### ES

Use [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

### AngularJS

Use ['angular.extend'](https://docs.angularjs.org/api/ng/function/angular.extend) for shallow merge 
or [`angular.merge`](https://docs.angularjs.org/api/ng/function/angular.merge) for deep merge
[The difference between 2](http://davidcai.github.io/blog/posts/copy-vs-extend-vs-merge/)

## state of page between refresh

### ES

I have no idea on this

### AngularJS

Use [`ui-router`](https://github.com/angular-ui/ui-router)

## parsing of datetypes

### ES

Use [`Date.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse)

### Angular

There is no built-in parse for Datetype, just for [date filter](https://docs.angularjs.org/api/ng/filter/date)

## NOTE

### Complete Compare

attaching event handlers
url building 			
string templating (safe, see XSS)
looking up element 	
for,					
mixing object
state of page between refresh
parsing of datetypes / use standard or encapuslate in functions

### Not to be done for specific framework
for loops, and operations inside ?
error handling, show errors to user ? how ?
security - output plane encoding (see OWASP), in short do not trust WS to probide valid data
style - top down - right to left, no pascal , not var, var, var, var, function starts with return statement ! if is replaced with ternary etc....
symetry - consistent api usage do not mix
