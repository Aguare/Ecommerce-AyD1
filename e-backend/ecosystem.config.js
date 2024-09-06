/** @format */

const ignore_paths = [
	"./msImg/public/*",
	"./msImg/public/**",
]

module.exports = {
	apps: [
		{
			name: "msAdmin",
			script: "./msAdmin/index.js",
			ignore_watch: ignore_paths,
			watch: "./msAdmin",
			env_production: {
				PORT: 3001,
				JWT_SECRET: "zl_frperg_xrl_cebcreqri",
				NODE_ENV: "production",
			},
		},
		{
			name: "msImg",
			script: "./msImg/index.js",
			ignore_watch: ignore_paths,
			watch: "./msImg",
			env_production: {
				PORT: 3002,
				JWT_SECRET: "zl_frperg_xrl_cebcreqri",
				NODE_ENV: "production",
				MAX_FILE_SIZE: '5000000',
				MAX_FILES: '10'
			},
		},
		{
			name: "msCustomer",
			script: "./msCustomer/index.js",
			ignore_watch: ignore_paths,
			watch: "./msCustomer",
			env_production: {
				PORT: 3003,
				NODE_ENV: "production"
			},
		},
		{
			name: "msProduct",
			script: "./msProduct/index.js",
			ignore_watch: ignore_paths,
			watch: "./msProduct",
			env_production: {
				PORT: 3004,
				NODE_ENV: "production"
			},
		},
		{
			name: "msCompany",
			script: "./msCompany/index.js",
			ignore_watch: paths,
			env_production: {
				PORT: 3005,
				NODE_ENV: "production"
			},
		}
	],
};
