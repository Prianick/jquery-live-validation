(function (jQuery) {

    var prValidation = function (element) {

        if (!(this instanceof prValidation)) {
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
                prVal.validate(this);
            });

            prVal.element.closest('form').submit(function (){
                var res =  prVal.validate(prVal.element);
                return res;
            })
        };

        /**
         * запустить валидацию инпута
         *
         * @returns {boolean}
         */
        this.validate = function (element) {
            var result = false;
            // запускаем все правила валидации поочереди
            for (var i = 0; i < this.rules.length; i++) {

                if (this.rules[i].live) {
                    //Проверяем это функция или нет
                    var getType = {};
                    var is_function = ( this.rules[i].expression && getType.toString.call(this.rules[i].expression) === '[object Function]');
                    if (is_function) {
                        result = this.rules[i].expression($(element));
                    } else {
                        result = this.preinstalValidationRules[this.rules[i].expression]($(element));
                    }
                    //если валидация не прошла, тогда прерываемся если нет, тогда запускаем следующее
                    if (result == false) {
                        this.showError($(element), this.rules[i]);
                        i = this.rules.length;
                    } else {
                        this.hideError($(element), this.rules[i]);
                    }
                }
            }

            return result;
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

            if (rule.callback != undefined) {
                rule.callback(elem);
            }
        };

        this.hideError = function (elem, rule) {
            $(elem).next(this.error_selector).remove();
        };


        this.preinstalValidationRules = {

            required: function (element) {
                if (element.val() == null || element.val() == '') {
                    return false;
                } else {
                    return true;
                }
            }

        };

        return this;
    };

    /**
     * добавляем в jQuery функцию для создание Валидатора
     *
     * @param rules -    {
     *                       expression: 'string' or function(element){},
     *                       message: 'Сообщение, которое будет отображаться при ошибке',
     *                       live: true,
     *                       callback: function(element){})
     *                   }
     */
    jQuery.fn.addValidationRules = function (rules) {

        //если надо создаем объект для хранения правил валидации
        if (this[0].prValidation != {}) {
            this[0].prValidation = new prValidation(this);
        }

        for (var i = 0; i < rules.length; i++) {
            rules[i].live = true;
        }

        this[0].prValidation.rules = rules;
        this[0].prValidation.bindEvents();
    }

})(jQuery);