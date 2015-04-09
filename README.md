Database

    - routes for:
        - '/sendOffer'
            - HTTP POST
            - parameters:
                - {"provider":string, "food":string, "address":string, "when":Date}
            - returns:
                - 200 if OK!
                - 300 if BAD!
        - '/claimOffer'
            - HTTP POST
            - paramters:
                - {"_id":_id, "login":login}
            - returns:
                - 200 if OK!
                - 300 if BAD!
        - '/myOffers.json?login=name'
            - HTTP GET
            - returns all offers claimed by a given login
        - '/providerOffers.json?provider=name&claimed=bool'
            - HTTP GET
            - returns all offers for a provider, claimed and unclaimed
        - '/allOffers'
            - HTTP GET
            - returns:
                [{"provider":string, "food":string, "address":string, "when":Date}, ...]

Status:

    - All routes check for parameters.
