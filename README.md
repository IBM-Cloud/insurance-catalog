# Cloud Insurance Co. - Catalog

| **master** | [![Build Status](https://travis-ci.org/IBM-Bluemix/insurance-catalog.svg?branch=master)](https://travis-ci.org/IBM-Bluemix/insurance-catalog) |
| ----- | ----- |
| **dev** | [![Build Status](https://travis-ci.org/IBM-Bluemix/insurance-catalog.svg?branch=dev)](https://travis-ci.org/IBM-Bluemix/insurance-catalog) |

This service is part of the larger [Cloud Insurance Co.](https://github.com/IBM-Bluemix/cloudco-insurance) project.

# Overview

A Node.js app that serves as an API into the policy database for the [Cloud Insurance Co.](https://github.com/IBM-Bluemix/cloudco-insurance). To store the insurance policies, we use a [Cloudant NoSQL DB][cloudant_url].

In order to deploy the full set of microservices involved, check out the [insurance-toolchain repo][toolchain_url]. Otherwise, you can deploy just the app by following the steps here.

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
  cf login -a https://api.ng.bluemix.net
  ```

7. Create the [Cloudant service][cloudant_service_url] in Bluemix

  ```
  cf create-service cloudantNoSQLDB Lite insurance-policy-db
  ```

8. Push the app to Bluemix

  ```
  cf push
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

5. Create a [Cloudant service][cloudant_service_url] named `insurance-policy-db` using your Bluemix account and replace the corresponding credentials in your `vcap-local.json` file - using `vcap-local.template.json` as template file.

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

The primary source of debugging information for your Bluemix app is the logs. To see them, run the following command using the Cloud Foundry CLI:

  ```
  $ cf logs insurance-catalog --recent
  ```
For more detailed information on troubleshooting your application, see the [Troubleshooting section](https://www.ng.bluemix.net/docs/troubleshoot/tr.html) in the Bluemix documentation.

## License

See [License.txt](License.txt) for license information.

# Privacy Notice

This application is configured to track deployments to [IBM Bluemix](http://www.ibm.com/cloud-computing/bluemix/) and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker](https://github.com/IBM-Bluemix/cf-deployment-tracker-service) service on each deployment:

* Node.js package version
* Node.js repository URL
* Application Name (`application_name`)
* Space ID (`space_id`)
* Application Version (`application_version`)
* Application URIs (`application_uris`)
* Labels of bound services
* Number of instances for each bound service and associated plan information

This data is collected from the `package.json` file in the application and the `VCAP_APPLICATION` and `VCAP_SERVICES` environment variables in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix to measure the usefulness of our examples, so that we can continuously improve the content we offer to you. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

## Disabling Deployment Tracking

Deployment tracking can be disabled by removing `require("cf-deployment-tracker-client").track();` from the beginning of the `app.js` file.

<!--Links-->
[toolchain_url]: https://github.com/IBM-Bluemix/insurance-toolchain
[bluemix_reg_url]: http://ibm.biz/insurance-store-registration
[cloud_foundry_url]: https://github.com/cloudfoundry/cli
[cloudant_url]: https://cloudant.com/
[cloudant_service_url]: https://new-console.ng.bluemix.net/catalog/services/cloudant-nosql-db/
[download_node_url]: https://nodejs.org/download/
[issues_url]: https://github.com/ibm-bluemix/insurance-catalog/issues
[travis_url]: https://travis-ci.org/
