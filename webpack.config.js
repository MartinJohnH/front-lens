const Dotenv = require('dotenv-webpack');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: [{ loader: 'file-loader', options: {} }],
            },
        ],
    },
    plugins: [
        new Dotenv()
    ]
};