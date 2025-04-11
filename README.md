# coding-project-template

## Start database service
- cd server/database
- docker build . -t nodeapp
- docker-compose up

## Start sentiment analyzer microservice
- docker build . -t us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer
- docker push us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer
- ibmcloud ce application create --name sentianalyzer --image us.icr.io/${SN_ICR_NAMESPACE}/senti_analyzer --registry-secret icr-secret --port 5000

## Start frontend
- cd server/frontend
- npm install
- npm run build