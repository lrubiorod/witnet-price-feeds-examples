import * as Witnet from "witnet-requests"

// Retrieves ETH price of OMG from the Binance API
const binance = new Witnet.Source("https://api.binance.com/api/v3/ticker/price?symbol=OMGETH")
  .parseJSONMap() // Parse a `Map` from the retrieved `String`
  .getFloat("price") // Get the `Float` value associated to the `price` key
  .multiply(1000000000) // Use 9 digit precision
  .round() // Cast to integer  

// Retrieves ETH price of OMG from the Gate.io API
const gateio = new Witnet.Source("https://data.gateapi.io/api2/1/ticker/omg_eth")
  .parseJSONMap() // Parse a `Map` from the retrieved `String`
  .getFloat("last") // Get the `Float` value associated to the `last` key
  .multiply(1000000000) // Use 9 digit precision
  .round() // Cast to integer

// Retrieves ETH price of OMG from the coinyep API
const coinyep = new Witnet.Source("https://coinyep.com/api/v1/?from=OMG&to=ETH&lang=es&format=json")
  .parseJSONMap() // Parse a Map from the retrieved String
  .getFloat("price") // Get the Map value associated to the price key
  .multiply(1000000000) // Use 9 digit precision
  .round()

const messari = new Witnet.Source("https://data.messari.io/api/v1/assets/omg/metrics")
.parseJSONMap()
.getMap("data")
.getMap("market_data")
.getFloat("price_eth")
.multiply(1000000000) // Use 9 digit precision
.round() // Cast to integer


// Filters out any value that is more than 1.5 times the standard
// deviationaway from the average, then computes the average mean of the
// values that pass the filter.
const aggregator = new Witnet.Aggregator({
  filters: [
    [ Witnet.Types.FILTERS.deviationStandard, 1.5 ],
  ],
  reducer: Witnet.Types.REDUCERS.averageMean,
})

// Filters out any value that is more than 1.0 times the standard
// deviationaway from the average, then computes the average mean of the
// values that pass the filter.
const tally = new Witnet.Tally({
  filters: [
    [ Witnet.Types.FILTERS.deviationStandard, 1.5 ],
  ],
  reducer: Witnet.Types.REDUCERS.averageMean,
})

// This is the Witnet.Request object that needs to be exported
const request = new Witnet.Request()
  .addSource(binance) // Use source 1
  .addSource(gateio) // Use source 2
  .addSource(coinyep) // Use source 3
  .addSource(messari) // use source 4
  .setAggregator(aggregator) // Set the aggregator function
  .setTally(tally) // Set the tally function
  .setQuorum(100, 70) // Set witness count
  .setFees(10, 1) // Set economic incentives
  .schedule(0) // Make this request immediately solvable

// Do not forget to export the request object
export { request as default }
