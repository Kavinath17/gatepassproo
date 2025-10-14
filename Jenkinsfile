pipeline {
    agent any

    environment {
        AWS_EC2_HOST = "ubuntu@13.62.59.80"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/Kavinath17/gatepassproo.git', 
                    credentialsId: 'github_gatepass_credentials'
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred-id', 
                    usernameVariable: 'DOCKER_USERNAME', 
                    passwordVariable: 'DOCKER_PASSWORD')]) {
                    bat """
                    "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" login -u %DOCKER_USERNAME% -p %DOCKER_PASSWORD% --password-stdin
                    """
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose build'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose push'
            }
        }

        stage('Deploy on EC2') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'aws-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    bat """
                    "C:\\Program Files\\Git\\usr\\bin\\ssh.exe" -o StrictHostKeyChecking=no -i "%SSH_KEY%" %AWS_EC2_HOST% "cd ~/gatepassproo && docker compose pull && docker compose down && docker compose up -d"
                    """
                }
            }
        }

        stage('Verify') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'aws-ssh-key', keyFileVariable: 'SSH_KEY')]) {
                    bat """
                    "C:\\Program Files\\Git\\usr\\bin\\ssh.exe" -o StrictHostKeyChecking=no -i "%SSH_KEY%" %AWS_EC2_HOST% "docker ps"
                    """
                }
            }
        }
    }
}

