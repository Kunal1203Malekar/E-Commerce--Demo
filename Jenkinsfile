pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
        DOCKER_IMAGE = "kunalmalekar/ecommerce-demo"
    }

    stages {
        
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/Kunal1203Malekar/E-Commerce--Demo.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $DOCKER_IMAGE:$BUILD_NUMBER .
                docker tag $DOCKER_IMAGE:$BUILD_NUMBER $DOCKER_IMAGE:latest
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh '''
                echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin
                docker push $DOCKER_IMAGE:$BUILD_NUMBER
                docker push $DOCKER_IMAGE:latest
                '''
            }
        }

        stage('Deploy to Server') {
            when {
                expression { return env.SERVER_IP != null }
            }
            steps {
                sh '''
                ssh -o StrictHostKeyChecking=no ubuntu@$SERVER_IP "
                    docker pull $DOCKER_IMAGE:latest &&
                    docker stop ecommerce || true &&
                    docker rm ecommerce || true &&
                    docker run -d -p 80:80 --name ecommerce $DOCKER_IMAGE:latest
                "
                '''
            }
        }
    }

    post {
        success {
            echo "🚀 Jenkins Pipeline Completed Successfully"
        }
        failure {
            echo "❌ Pipeline Failed"
        }
    }
}
