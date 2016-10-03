(function (jQuery) {

    var prValidation = function (element) {

        if (!(this instanceof prValidation)){
            return this;
        }

        this.rules = [];
        this.element = element; // html элемент для которого мы устанавливаем правила валидации

        this.error_selector = '.error-notification';
        this.error_html = '<div class=\'error-notification\'></div>';

        /**
         * вешамаем события валидации
         */
        this.bindEvents = function () {
            var prVal = this;
            prVal.element.blur(function () {
                var result = false;
                // запускаем все правила валидации поочереди
                for (var i = 0; i < prVal.rules.length; i++) {

                    if (prVal.rules[i].live) {
                        //если валидация не прошла, тогда прерываемся если нет, тогда запускаем следующее
                        result = prVal.rules[i].expression($(this));
                        if (result == false) {
                            prVal.showError($(this), prVal.rules[i]);
                            break;
                        } else {
                            prVal.hideError($(this), prVal.rules[i]);
                        }
                    }
                }
            });
        };

        /**
         * показываем сообщение в случае если валдция не прошла
         *
         * @param elem
         * @param rule
         */
        this.showError = function (elem, rule) {
            $(elem).next(this.error_selector).remove();
            var $error_sign = $(this.error_html);

            $(elem).after($error_sign);
            $(elem).addClass('error');
            $error_sign.html(rule.message);
        };

        this.hideError = function (elem, rule) {
            $(elem).next(this.error_selector).remove();
        };

        return this;
    };

    /**
     * добавляем в jQuery функцию для создание Валидатора
     * @param options
     */
    jQuery.fn.addValidationRule = function (options) {

        //если надо создаем объект для хранения правил валидации
        if (this[0].prValidation != {}) {
            this[0].prValidation = new prValidation(this);
        }

        //добавляем правило валидации
        var rule = {};

        //назначаем событие валидации
        rule.message = options.message;
        rule.expression = options.expression;
        rule.live = true; //options.live;
        rule.error_class = options.errorClass;
        rule.error = options.error;

        this[0].prValidation.rules.push(rule);
        this[0].prValidation.bindEvents();
    }

})(jQuery);