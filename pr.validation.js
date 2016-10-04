(function (jQuery) {

    var prValidation = function (element) {

        if (!(this instanceof prValidation)) {
            return this;
        }

        this.rules = [];
        this.element = element; // html элемент для которого мы устанавливаем правила валидации

        this.error_selector = '.error-notification';
        this.error_html = '<div class=\'error-notification\'></div>';
        this.is_validation_completed = false;
        this.$form = this.element.closest('form');
        this.submit_btn = this.$form.find('[type=submit]');

        this.submit_btn.prop('disabled', true);

        /**
         * вешамаем события валидации
         */
        this.bindEvents = function () {
            var prVal = this;

            prVal.element.blur(function () {
                prVal.validate(this);
            });

            prVal.element.focus(function () {
                prVal.refreshNotification(this);
            });

            prVal.element.closest('form').submit(function () {
                var result = prVal.validate(prVal.element);
                return result;
            })
        };

        this.init = function () {
            if (this.element.val() != '') {
                this.validate(this.element);
            }
        };

        /**
         * При фокусе все callback'и вызываются с сообщеием null,
         * чтобы можно было сбросить или скрыть все уведомления показанные ранее
         *
         * @param element
         */
        this.refreshNotification = function (element) {
            for (var i = 0; i < this.rules.length; i++) {
                if (this.rules[i].callbackFunction != undefined) {
                    this.rules[i].callbackFunction($(element), true);
                }
            }
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
                    // Если валидация не прошла, тогда прерываемся. Если нет, тогда запускаем следующее правило.
                    if (result == false) {
                        this.showError($(element), this.rules[i]);
                        this.is_validation_completed = false;
                    } else {
                        this.hideError($(element), this.rules[i]);
                        this.is_validation_completed = true;
                    }

                    if (this.rules[i].callbackFunction != undefined) { // Вызываем callback, если он есть.
                        this.rules[i].callbackFunction($(element), result);
                    }

                    if (result == false) { // Прерываем валидацию так как нашли ошибку.
                        i = this.rules.length;
                    }
                    this.checkSubmitBtnAvailability();
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
        };

        this.hideError = function (elem, rule) {
            $(elem).next(this.error_selector).remove();
            $(elem).removeClass('error');
        };


        this.preinstalValidationRules = {

            required: function (element) {
                if (element.val() == null || element.val() == '') {
                    return false;
                } else {
                    return true;
                }
            },

            email: function (element) {
                var val = element.val();
                if (val.match(/^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@([a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\.)*(aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$/)) {
                    return true;
                } else {
                    return false;
                }
            },

            digits: function (element) {
                var val = element.val();
                if (val.match(/^[0-9]*$/)) {
                    return true;
                } else {
                    return false;
                }
            }

        };

        /**
         * Функция проверяет можно ли дать доступ к кнопке submit
         */
        this.checkSubmitBtnAvailability = function () {
            this.$form.find('input').each(function (element) {
                if (this.prValidation != undefined) {
                    if (this.prValidation.is_validation_completed) {
                        this.prValidation.submit_btn.prop('disabled', false);
                    } else {
                        this.prValidation.submit_btn.prop('disabled', true);
                        return false;
                    }
                }
            })
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
     *                       callback: function(element, result){})
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
        this[0].prValidation.init();
    }

})(jQuery);