pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: dind
    image: docker:24-dind
    securityContext:
      privileged: true
    resources:
      requests:
        memory: "1Gi"
        cpu: "500m"
      limits:
        memory: "4Gi"
        cpu: "1"
    volumeMounts:
    - name: workspace-volume
      mountPath: /home/jenkins/agent
  - name: jnlp
    image: jenkins/inbound-agent:latest
    volumeMounts:
    - name: workspace-volume
      mountPath: /home/jenkins/agent
  volumes:
  - name: workspace-volume
    emptyDir: {}
"""
    }
  }

  environment {
    IMAGE_NAME = "kunalmalekar/ecommerce-demo"
    TAG = "4"
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Build Docker Image') {
      steps {
        // run inside the container that has docker client & daemon
        container('dind') {
          sh '''
            docker version
            docker build -t ${IMAGE_NAME}:${TAG} .
          '''
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        container('dind') {
          withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PSW')]) {
            sh '''
              echo $DOCKER_PSW | docker login -u $DOCKER_USER --password-stdin
              docker push ${IMAGE_NAME}:${TAG}
            '''
          }
        }
      }
    }

    // other stages...
  }

  post {
    failure { echo "❌ Pipeline Failed" }
  }
}
