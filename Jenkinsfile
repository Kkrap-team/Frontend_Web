pipeline {
  agent any
  options { timestamps() }

  environment {
    REGISTRY   = "docker.io"
    IMAGE      = "kkrapfront/kkrap-web"
    GIT_SHA    = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
    VERSION    = "${GIT_SHA}-${env.BUILD_NUMBER}"
    TRACK      = "dev"                         // compose의 WEB_IMAGE_TAG=dev 기준

    SSH_HOST   = "ubuntu@ci.kkrap.cloud"       // 도메인 사용
    REMOTE_DIR = "/home/ubuntu/kkrap-app"
  }

  stages {
    stage('Checkout') { steps { checkout scm } }

    stage('Build & Push Image (Vite→Nginx)') {
      when { expression { env.BRANCH_NAME ==~ /release\/.*/ } }  // release/* 만
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub-frontend',  // ← 프론트용 Docker Hub 크리덴셜
          usernameVariable: 'USER',
          passwordVariable: 'PASS'
        )]) {
          sh """
            docker build -t ${REGISTRY}/${IMAGE}:${VERSION} .
            docker tag  ${REGISTRY}/${IMAGE}:${VERSION} ${REGISTRY}/${IMAGE}:${TRACK}
            echo $PASS | docker login -u $USER --password-stdin
            docker push ${REGISTRY}/${IMAGE}:${VERSION}
            docker push ${REGISTRY}/${IMAGE}:${TRACK}
            docker logout ${REGISTRY} || true
          """
        }
      }
    }

    stage('Deploy to EC2') {
      when { expression { env.BRANCH_NAME ==~ /release\/.*/ } }
      steps {
        sshagent(credentials: ['ec2-ssh']) {
            sh """
                ssh -o StrictHostKeyChecking=no ${SSH_HOST} \
                'cd ${REMOTE_DIR} && ./deploy.sh \$(grep ^WEB_IMAGE_TAG .env | cut -d= -f2) ${TRACK}'
            """
        }
      }
    }
  }

  post {
    success { echo "Frontend deployed: ${env.BRANCH_NAME} → ${VERSION} (track:${TRACK})" }
    failure { echo "Frontend failed: ${env.BRANCH_NAME}" }
  }
}
