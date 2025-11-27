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
    TAG = "latest"          // you can change version
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        container('dind') {
          sh '''
            echo "🔨 Building Docker Image..."
            docker version
            docker build -t ${IMAGE_NAME}:${TAG} .
          '''
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        container('dind') {
          withCredentials([usernamePassword(
              credentialsId: 'dockerhub-kunal',
              usernameVariable: 'DOCKER_USER',
              passwordVariable: 'DOCKER_PSW'
          )]) {
            sh '''
              echo "📦 Logging into Docker Hub..."
              echo $DOCKER_PSW | docker login -u $DOCKER_USER --password-stdin

              echo "⬆️ Pushing Image to Docker Hub..."
              docker push ${IMAGE_NAME}:${TAG}

              echo "🎉 Docker Push Completed!"
            '''
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        echo "🚀 Add deployment script here later…"
      }
    }

  }

  post {
    failure {
      echo "❌ Pipeline Failed"
    }
    success {
      echo "✅ Pipeline Success"
    }
  }
}
