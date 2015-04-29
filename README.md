Server

    - routes for:
        - insert routes:
            - '/sendOffer'
                - POST
                - parameters:
                    - {"provider":string, "food":string, "address":string, "when":Date}
                - returns:
                    - 200 if OK!
                    - 300 if BAD!
            - '/claimOffer'
                - POST
                - paramters:
                    - {"_id":_id, "login":login}
                - returns:
                    - 200 if OK!
                    - 300 if BAD!
        - query routes:
            - '/userOffers?login=name'
                - GET
                - if login:
                    - returns all offers claimed by a given login
                - else:
                    - returns all open offers
                - return format:
                    [{"provider":string, "food":string, "address":string, "when":Date}, ...]
            - '/providerOffers?provider=name&claimed=bool'
                - GET
                - returns all offers for a provider, claimed and unclaimed
        - user routes:
            - '/signUp'
                - POST
                - Parameters: 
                    OLD [ username:string, name:string, email:string, phone:string, password:string ]
                    NEW: [ username:string, name:string, email:string, password:string ]
                - returns:
                    - 200 for OK!
                    - if username or handle exists, returns "ALREADY USED"
            - '/signIn'
                - POST
                - parameters:
                    - [ username:string, password:string ]
                - Returns:
                    - 200 for OK!
                    - 403 for bad password
                    - 404 for bad username
        - clear db:
            - '/dbClear'
                - GET
                - parameters:
                    - {"collection":string, "password":string}
                - returns:
                    - 200 if OK!
                    - 403 if bad password
    - collections:
        - offers
            - Holds Provider-Posted Offers
            - Parameters
                - Mandatory:
                    [ provider:string, food:string, address:string, when:string ]
                - Optional:
                    [ quantity:number ]
        - users
            - Holds user account information (no distinction between usertypes)
            - Parameters:
                - [ username:string, name:string, email:string, phone:string, password:string ]
        - claims
            - Holds User-Claimed Offers
            - Parameters:
                - [ login:string, provider:string, food:string, address:string, when:string ]

Status

    - All routes check for parameters.
    - No routes check for timed out offers yet
    - Written
        - /sendOffer
        - /claimOffer
        - /userOffers
        - /providerOffers
        - /dbClear
        - /signUp
        - /signIn
    - Untested
        - /userOffers
        - /providerOffers