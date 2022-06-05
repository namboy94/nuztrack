# Setting up Keycloak

# General

* Create new realm "Nuztrack"
* Add role 'user'
* Add user
    * username
        * save
    * credentials
        * set password
    * role mappings
        * user

# Server

* Add Client
    * ClientID: 'backend'
        * Save
    * Valid Redirect URIs: http://localhost:8080/*
        * Save

# Frontend

* Add Client
    * ClientID: 'frontend'