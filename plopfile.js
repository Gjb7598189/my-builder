module.exports = function (plop) {
    plop.setGenerator('controller', {
        description: 'new a page file',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'enter the name'
        }],
        actions: [{
            type: 'add',
            path: 'src/{{name}}.js',
            templateFile: './template/page.hbs'
        }]
    });
};