pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-cred-id')
        SSH_KEY = credentials('aws-ssh-key')
        AWS_EC2_HOST = "ubuntu@16.171.10.176"
        DOCKERHUB_REPO = "kavinath"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Kavinath17/gatepassproo.git', credentialsId: 'github_gatepasspro_credentials'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-cred-id', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh '''
                    echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                    docker-compose push
                    '''
                }
            }
        }

        stage('Deploy on EC2') {
            steps {
                sshagent(['aws-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no $AWS_EC2_HOST "
                    cd ~/gatepassproo &&
                    docker-compose pull &&
                    docker-compose down &&
                    docker-compose up -d"
                    '''
                }
            }
        }

        stage('Verify') {
            steps {
                sshagent(['aws-ssh-key']) {
                    sh 'ssh $AWS_EC2_HOST "docker ps"'
                }
            }
        }
    }
}
