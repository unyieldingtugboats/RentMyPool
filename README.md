# RentMyPool

## Team

  - __Product Owner__: Eden Mazzola
  - __Scrum Master__: Derek Boero
  - __Development Team Members__: 
    John Pizzo,
    Eden Mazzola,
    Derek Boero,
    David Kiesewetter

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> This app allows users to either post thier own pool for rent or search through a list of posted pools to rent. A user is first taken to the home page. From there, the user will either need to Sign-Up or Login. After Login, the user can navigate to the List page or the Rent page. 

> From the List page the user can post thier pool to the site, uploading thier Name, Address, Price of thier pool, Date thier pool is available and an image of thier pool. 

> From the Rent page the user sees a list of pools that are available for rent. Users are able to search through available pools by Date or Location. Clicking on a pool in the list shows it's location on the map and an image of the pool below. Users are then alble to select the "Book Now" button which redirects them to the payments page. Payments are facilitated through Stripe API. 


## Requirements

- Node 0.10.x
- Redis 2.6.x
- Postgresql 9.1.x
- etc
- etc

## Development

### Installing Dependencies

From within the root directory:

```sh
sudo npm install -g bower
npm install
bower install
```

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
