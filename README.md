Server

- routes for:
    - insert routes:
        - '/sendOffer'
            - POST
            - parameters:
                - {"seller":string, "food":string, "address":string, "lat":number, "lng":number, "when":Date, "price":number}
            - returns:
                - 200 if OK!
                - 400 if BAD!
        - '/claimOffer'
            - POST
            - paramters:
                - {"_id":string, "buyer":string}
            - returns:
                - 200 if OK!
                - 400 if BAD!
    - query routes:
        - '/offers?mode={buy || sell}&claimed={true || false}&username=string'
            - GET
            - mode[BUY], claimed[TRUE], username REQUIRED
                - returns offers claimed buy the user
                - ['buyer':string, 'seller':string, 'address':string, 'lat':number, 'lng':number, 'food':string, 'when':string, 'price':number]
            - mode[BUY], claimed[FALSE], username OPTIONAL
                - returns all unclaimed offers
                - [seller':string, 'address':string, 'lat':number, 'lng':number, 'food':string, 'when':string, 'price':number]
            - mode[SELL], claimed[TRUE], username REQUIRED
                - returns claimed offers posted by the user
                - ['buyer':string, 'seller':string, 'address':string, 'lat':number, 'lng':number, 'food':string, 'when':string, 'price':number]
            - mode[SELL], claimed[FALSE], username REQUIRED
                - returns all unclaimed offers posted by the user
                - [seller':string, 'address':string, 'lat':number, 'lng':number, 'food':string, 'when':string, 'price':number]
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
                [ seller:string, food:string, address:string, lat:number, lng:number, when:string, price:number]
            - Optional:
                [ quantity:number ] - (defaults to 1)
    - users
        - Holds user account information (no distinction between usertypes)
        - Parameters:
            - [ username:string, name:string, email:string, password:string ]
    - claims
        - Holds User-Claimed Offers
        - Parameters:
            - [ buyer:string, seller:string, food:string, address:string, lat:number, lng:number, when:string, price:number ]

Status

- All routes check for parameters.
- No routes check for timed out offers yet
- Written
    - /sendOffer
    - /claimOffer
    - /offers
    - /dbClear
    - /signUp
    - /signIn