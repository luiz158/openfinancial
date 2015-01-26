module.exports = function(app){

  var service = app.services.payment;

  var findPayment = function(id, payments){
    for (var index in payments) {
      if (payments[index].id == id){
        return {payment:payments[index], index:index};
      }
    }
  };

  var PaymentController = {

    index: function(req, res) {
      var id = req.params.id;
      var logged_user = req.session.logged_user;
      if ( logged_user ) {
        res.render('payment/index', {payments:logged_user.payments});
      } else {
        res.redirect('/');
      }
    },

    edit: function(req, res) {
      var id = req.params.id;
      var logged_user = req.session.logged_user;
      if ( logged_user ) {
        var payment = service.findIn(id, logged_user.payments).payment;
        if ( payment ) {
          res.status(200).send(payment);

        } else {
          res.status(400).send({message:'Not found'});

        }
      } else {
        res.status(400).send({message:'Not found'});

      }
    },

    create: function(req, res) {
      var logged_user = req.session.logged_user;
      if ( logged_user ) {
        var payment = req.body.payment;

        if ( payment.id ) {
          var id = payment.id;
          var paymentFound = service.findIn(id, logged_user.payments).payment;
          paymentFound.description = payment.description;
          paymentFound.price = payment.price;
          paymentFound.date = payment.date;

        } else {
          service.save(payment);
          logged_user.payments.push(payment);

        }
        res.render('payment/index', {payments:logged_user.payments});

      } else {
        res.redirect('/');

      }
    },

    update: function(req, res) {

    },

    delete: function(req, res) {
      var logged_user = req.session.logged_user;
      if ( logged_user ) {
        var response = service.findIn(req.params.id, logged_user.payments);
        logged_user.payments.splice(response.index, 1);
        res.redirect('/payment');

      } else {
        res.redirect('/');

      }
    }

  };
  return PaymentController;
};
