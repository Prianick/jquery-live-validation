# jquery-live-validation

Пагин позволяет добавлять правила валидации к инпутам. Валидация запускается после расфокуса.

Пример использования:

  var rule1 = {};
  rule1.expression = 'required';
  rule1.message = 'Необходимо заполнить это поле';
  var rule2 = {};
  rule2.expression = 'digits';
  rule2.message = 'Необходимо ввести число';
  $('input[name=user-phone]').addValidationRules([rule1, rule2]);

