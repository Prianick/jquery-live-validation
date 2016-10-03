# jquery-live-validation

Плагин позволяет добавлять правила валидации к инпутам. Валидация запускается после расфокуса.

Пример использования:
--------------------

```javascript
  var rule1 = {};   
  rule1.expression = 'required';  //email, digits
  rule1.message = 'Необходимо заполнить это поле';  
  var rule2 = {};  
  rule2.expression = function (element) {
    if(elment.val() != '') {
      return true;
    } else {
      return false;
    }
  };  
  rule2.message = 'Необходимо заполнить это поле';  
  $('input[name=user-phone]').addValidationRules([rule1, rule2]);  
```
