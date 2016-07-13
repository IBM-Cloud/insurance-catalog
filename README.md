# insurance-catalog

[![Build Status](https://travis-ci.org/IBM-Bluemix/insurance-catalog.svg?branch=master)](https://travis-ci.org/IBM-Bluemix/insurance-catalog)

A Node.js app that serves as an API into the policy database for the [insurance-store-front][store_front_url]. To store the insurance policies, we use a [Cloudant NoSQL DB][cloudant_url] and then utilize [Watson Tradeoff Analytics][ta_url] to evaluate comparisons between the them.

In order to deploy the full set of microservices involved in the insurance-store demo, check out the [insurance-toolchain repo][toolchain_url]. Otherwise, you can deploy just the app by following the steps here.

## Running the app on Bluemix

1. If you do not already have a Bluemix account, [sign up here][bluemix_reg_url]

2. Download and install the [Cloud Foundry CLI][cloud_foundry_url] tool

3. Clone the app to your local environment from your terminal using the following command:

  ```
  git clone https://github.com/IBM-Bluemix/insurance-catalog.git
  ```

4. `cd` into this newly created directory

5. Open the `manifest.yml` file and change the `host` value to something unique.

  The host you choose will determinate the subdomain of your application's URL:  `<host>.mybluemix.net`

6. Connect to Bluemix in the command line tool and follow the prompts to log in

  ```
  $ cf login -a https://api.ng.bluemix.net
  ```

7. Create the [Cloudant service][cloudant_service_url] in Bluemix

  ```
  $ cf create-service cloudantNoSQLDB Shared policy-db
  ```

8. Create the [Tradeoff Analytics service][tradeoff_analytics_service_url] in Bluemix

  ```
  $ cf create-service tradeoff_analytics standard insurance-tradeoff-analytics
  ```

9. Push the app to Bluemix

  ```
  $ cf push --no-start
  ```

10. Bind the Cloudant service to your app

  ```
  $ cf bind-service insurance-catalog policy-db
  ```

11. Start your app

  ```
  $ cf start insurance-catalog
  ```

And voila! You now have your very own instance of the Insurance Catalog API running on Bluemix.

## Run the app locally

1. If you do not already have a Bluemix account, [sign up here][bluemix_reg_url]

2. If you have not already, [download Node.js][download_node_url] and install it on your local machine.

3. Clone the app to your local environment from your terminal using the following command:

  ```
  git clone https://github.com/IBM-Bluemix/insurance-catalog.git
  ```

4. `cd` into this newly created directory

5. Create a [Cloudant service][cloudant_service_url] named `policy-db` using your Bluemix account and replace the corresponding credentials in your `vcap-local.json` file

6. Create a [Tradeoff Analytics service][tradeoff_analytics_service_url] named `insurance-tradeoff-analytics` using your Bluemix account and replace the corresponding credentials in your `vcap-local.json` file

7. Install the required npm packages using the following command

  ```
  npm install
  ```

8. Start your app locally with the following command

  ```
  npm start
  ```

This command will start your Node.js web server and print the address where it is listening to requests in the console: `server starting on http://localhost:6034`.

## API documentation

**`POST /tradeoff`:** Takes input criteria for a prospective trip and returns eligible policies and their Tradeoff Analytics results.

_**params**_  
**tripDuration&ast;** _(int)_ - The length of the trip in days  
**tripCost&ast;** _(int)_ - The estimated cost of the trip  
**addTravelers** _(int[ ])_ - Age of each additional traveler, not including policy owner  
**refund** _(int)_ - The percentage of policy eligible for a refund upon cancellation  
**reviews** _(int)_ - The average star rating that the policy has received from previous customers  
**policyCost** _(int)_ - The maximum amount that the user desires to spend on the policy  

_**results**_  
[**columns**][column_spec_url]**&ast;** _(object[ ])_ - Conditions used to evaluate the tradeoff between eligible policies  
**policies&ast;** _(policy[ ])_ - Policies deemed as the best options, ordered alphabetically by name  
[**map**][map_spec_url] _(object)_ - The two-dimensional positioning of each option on the map polygon displayed by the Tradeoff Analytics visualization.

_**Note**: Asterisks ( **&ast;** ) mark required field_

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

The primary source of debugging information for your Bluemix app is the logs. To see them, run the following command using the Cloud Foundry CLI:

  ```
  $ cf logs insurance-catalog --recent
  ```
For more detailed information on troubleshooting your application, see the [Troubleshooting section](https://www.ng.bluemix.net/docs/troubleshoot/tr.html) in the Bluemix documentation.

## License

See [License.txt](License.txt) for license information.

<!--Links-->
[store_front_url]: https://github.com/IBM-Bluemix/insurance-store-front
[toolchain_url]: https://github.com/IBM-Bluemix/insurance-toolchain
[bluemix_reg_url]: http://ibm.biz/insurance-store-registration
[cloud_foundry_url]: https://github.com/cloudfoundry/cli
[cloudant_url]: https://cloudant.com/
[ta_url]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/tradeoff-analytics.html
[cloudant_service_url]: https://new-console.ng.bluemix.net/catalog/services/cloudant-nosql-db/
[tradeoff_analytics_service_url]: https://new-console.ng.bluemix.net/catalog/services/tradeoff-analytics/
[column_spec_url]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/tradeoff-analytics/api/v1/?node#Column
[solution_spec_url]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/tradeoff-analytics/api/v1/?node#Solution
[map_spec_url]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/tradeoff-analytics/api/v1/?node#Map
[download_node_url]: https://nodejs.org/download/
[issues_url]: https://github.com/ibm-bluemix/insurance-catalog/issues
[travis_url]: https://travis-ci.org/