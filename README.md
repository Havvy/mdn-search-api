This project exists as a set of APIs for the [Mozilla Developer Network Search
Interface](https://developer.mozilla.org/en-US/docs/MDN/Contribute/Tools/Search),
one for each language.

The overall API is to have a builder for the query URL and a converter from the
JSON response to the equivalent of a struct or class in the language.

Not part of this project is the actually sending of the HTTPS request. As such,
proper usage is something like the following psuedocode:

```
require mdn_search
require https_request

let mdn_search_url = mdn_search.Builder().locale("en-US").query("table").build()

// Ignoring error handling and header/body parsing here
let json_response = https_request(mdn_search_url)

let mdn_response = mdn_search.Response(json_response)
```

For specific reference docs, look inside each project's directory.