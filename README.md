# 2018-06-21: Inactive development, repository archived
The orders and catalog microservices are not used by the [Cloud Insurance Co.](https://github.com/IBM-Cloud/cloudco-insurance) project. Thus, this repository is no longer maintained and is archived.

# Cloud Insurance Co. - Catalog

| **master** | [![Build Status](https://travis-ci.org/IBM-Cloud/insurance-catalog.svg?branch=master)](https://travis-ci.org/IBM-Cloud/insurance-catalog) |
| ----- | ----- |
| **dev** | [![Build Status](https://travis-ci.org/IBM-Cloud/insurance-catalog.svg?branch=dev)](https://travis-ci.org/IBM-Cloud/insurance-catalog) |

This service is part of the larger [Cloud Insurance Co.](https://github.com/IBM-Cloud/cloudco-insurance) project.

# Overview

A Node.js app that serves as an API into the policy database for the [Cloud Insurance Co.](https://github.com/IBM-Cloud/cloudco-insurance). To store the insurance policies, we use an [IBM Cloudant database][cloudant_url].

In order to deploy the full set of microservices involved, check out the [insurance-toolchain repo][toolchain_url]. Otherwise, you can deploy just the app by following the steps here.

## Running the app on IBM Cloud

1. If you do not already have a IBM Cloud account, [sign up here][bluemix_reg_url].

2. Download and install the [IBM Cloud CLI][ibmcloud_cli_url] tool.

3. Clone the app to your local environment from your terminal using the following command:

  ```
  git clone https://github.com/IBM-Cloud/insurance-catalog.git
  ```

4. `cd` into this newly created directory.

5. Open the `manifest.yml` file and change the `host` value to something unique.

  The host you choose will determinate the subdomain of your application's URL:  `<host>.mybluemix.net`

6. Connect to IBM Cloud in the command line tool and follow the prompts to log in:

  ```
  ibmcloud cf login -a https://api.ng.bluemix.net
  ```

7. Create the [Cloudant service][cloudant_service_url] in IBM Cloud:

  ```
  ibmcloud cf create-service cloudantNoSQLDB Lite insurance-policy-db
  ```

8. Push the app to IBM Cloud:

  ```
  ibmcloud cf push
  ```

Done, that's all! You now have your very own instance of the Insurance Catalog API running on IBM Cloud.

## Run the app locally

1. If you do not already have a IBM Cloud account, [sign up here][bluemix_reg_url]

2. If you have not already, [download Node.js][download_node_url] and install it on your local machine.

3. Clone the app to your local environment from your terminal using the following command:

  ```
  git clone https://github.com/IBM-IBM Cloud/insurance-catalog.git
  ```

4. `cd` into this newly created directory

5. Create a [Cloudant service][cloudant_service_url] named `insurance-policy-db` using your IBM Cloud account and replace the corresponding credentials in your `vcap-local.json` file - using `vcap-local.template.json` as template file.

6. Install the required npm packages using the following command

  ```
  npm install
  ```

7. Start your app locally with the following command

  ```
  npm start
  ```

This command will start your Node.js web server and print the address where it is listening to requests in the console: `server starting on http://localhost:6034`.

## Insurance Policies

The insurance-catalog app serves as the API to the Cloud Insurance Co. repository of insurance policies. When the app is initialized it checks for the existence of a `policies` DB in the Cloudant datastore. If it does not exist, it creates the DB and populates it with the initial policy docs from the [`routes/starter_docs/policies.json`](./routes/starter_docs/policies.json) file. Subsequently, policies in the DB can be manipulated through the API.

### Policy Fields
**name**: Policy short name  
**desc**: Longer description of the policy  
**baseCost**: Cost of the policy at the minimum number of days and without additional travelers  
**perAddTraveler&ast;**: Percentage increase to the base policy per additional traveler  
**cancelRefund**: The percentage of the policy cost refunded upon cancellation before the start of the trip  
**minDays**: The minimum number of days for a trip to qualify  
**perAddDay&ast;**: Percentage increase to the base policy per additional day after the minimum number of days  
**levelCare**: Tier of care provided by the policy  
**amount**: Multiplier to determine coverage amount relative to policy cost  
**review**: Average star rating given to the policy by previous customers  

**&ast;** Cost compounded on each addition

_**Note**: When updating the default policies in `routes/db.js`, make sure to delete the `policies` DB before the app is re-deployed so that the new policies are uploaded._

## Contribute
If you find a bug, please report it via the [Issues section][issues_url] or even better, fork the project and submit a pull request with your fix! We are more than happy to accept external contributions to this project if they address something noted in an existing issue.  In order to be considered, pull requests must pass the initial [Travis CI][travis_url] build and/or add substantial value to the sample application.

## Troubleshooting

The primary source of debugging information for your IBM Cloud app is the logs. To see them, run the following command using the IBM Cloud CLI tool:

  ```
  $ ibmcloud cf logs insurance-catalog --recent
  ```
## License

See [License.txt](License.txt) for license information.

<!--Links-->
[toolchain_url]: https://github.com/IBM-Bluemix/insurance-toolchain
[bluemix_reg_url]: http://ibm.biz/insurance-store-registration
[ibmcloud_cli_url]: https://console.bluemix.net/docs/cli/reference/bluemix_cli/get_started.html#getting-started
[cloudant_url]: https://console.bluemix.net/docs/services/Cloudant/
[cloudant_service_url]: https://console.bluemix.net/catalog/services/cloudant-nosql-db/
[download_node_url]: https://nodejs.org/download/
[issues_url]: https://github.com/IBM-Cloud/insurance-catalog/issues
[travis_url]: https://travis-ci.org/
