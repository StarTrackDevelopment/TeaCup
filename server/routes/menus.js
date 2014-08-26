'use strict';

var mean = require('meanio');

module.exports = function(app) {

    app.route('/admin/menu/:name')
        .get(function(req, res) {
            var roles = (req.user ? req.user.roles : ['anonymous']);
            var menu = req.params.name ? req.params.name : 'main';
            var defaultMenu = (req.query.defaultMenu ? req.query.defaultMenu : []);

            defaultMenu.forEach(function(item, index) {
                defaultMenu[index] = JSON.parse(item);
            });

            var items = mean.menus.get({
                roles: roles,
                menu: menu,
                defaultMenu: defaultMenu
            });

            var sorteditems = [];
            var itemstoremove = [];

            items.forEach(function (itm, index) {
                if (itm.link.search('teacup') !== -1) {
                    sorteditems[sorteditems.length] = itm;
                    itemstoremove[itemstoremove.length] = index;
                }
            });


            items.forEach(function (itm, index) {
                if (itm.link.search('user') !== -1) {
                    sorteditems[sorteditems.length] = itm;
                    itemstoremove[itemstoremove.length] = index;
                }
            });

            items.forEach(function (itm, index) {
                if (itm.link.search('room') !== -1) {
                    sorteditems[sorteditems.length] = itm;
                    itemstoremove[itemstoremove.length] = index;
                }
            });

            itemstoremove.sort();
            itemstoremove.reverse();
            itemstoremove.forEach(function (itmindex) {
                items.splice(itmindex, 1);
            });

            itemstoremove = [];

            items.forEach(function (itm) {
                sorteditems[sorteditems.length] = itm;
            });

            //res.jsonp(items);
            res.jsonp(sorteditems);
            });

};
