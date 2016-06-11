# insurance-catalog

A Node.js app that serves as an API into the policy database for the [insurance-store-front][store_front_url]. To store the insurance policies, we use a [Cloudant NoSQL DB][cloudant_url] and then utilize [Watson Tradeoff Analytics][ta_url] to evaluate comparisons between the them.

In order to deploy the full set of microservices involved in the insurance-store demo, check out the [insurance-toolchain repo][toolchain_url].

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy)

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

9. Push the app to Bluemix.

  ```
  $ cf push
  ```

And voila! You now have your very own instance of the Insurance Catalog API running on Bluemix.

## API documentation

**`POST /tradeoff`:** Takes input criteria for a prospective trip and returns eligible policies and their Tradeoff Analytics results.

_**params**_  
**tripDuration\*** _(int)_ - The length of the trip in days  
**tripCost\*** _(int)_ - The estimated cost of the trip  
**addTravelers** _(int[ ])_ - Age of each additional traveler, not including policy owner  
**refund** _(int)_ - The percentage of policy eligible for a refund upon cancellation  
**reviews** _(int)_ - The average star rating that the policy has received from previous customers  
**policyCost** _(int)_ - The maximum amount that the user desires to spend on the policy  

_**results**_  
[**columns**][column_spec_url]**\*** _(object[ ])_ - Conditions used to evaluate the tradeoff between eligible policies  
**policies\*** _(policy[ ])_ - Policies deemed as the best options, ordered alphabetically by name  
[**map**][map_spec_url] _(object)_ - The two-dimensional positioning of each option on the map polygon displayed by the Tradeoff Analytics visualization.

_**Note**: Asterisks ( *\** ) mark required field_

## Troubleshooting

The primary source of debugging information for your Bluemix app is the logs. To see them, run the following command using the Cloud Foundry CLI:

  ```
  $ cf logs insurance-catalog --recent
  ```
For more detailed information on troubleshooting your application, see the [Troubleshooting section](https://www.ng.bluemix.net/docs/troubleshoot/tr.html) in the Bluemix documentation.

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