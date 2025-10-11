pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-cred-id')  // Docker Hub credentials ID
        SSH_KEY = credentials('aws-ssh-key')                       // Jenkins SSH key for EC2
        AWS_EC2_HOST = "ubuntu@16.171.10.176"                     // Your EC2 public IP
        DOCKERHUB_REPO = "kavinath"                                // Your Docker Hub username
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Kavinath17/gatepassproo.git',
                    credentialsId: 'github_gatepasspro_credentials'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building Docker images..."
                bat "docker-compose build"
            }
        }

        stage('Push Docker Images to Docker Hub') {
            steps {
                script {
                    echo "Logging in to Docker Hub..."
                    bat "echo %DOCKERHUB_CREDENTIALS_PSW% | docker login -u %DOCKERHUB_CREDENTIALS_USR% --password-stdin"

                    echo "Pushing frontend image..."
                    bat "docker-compose push frontend"

                    echo "Pushing backend image..."
                    bat "docker-compose push backend"
                }
            }
        }

        stage('Deploy to AWS EC2') {
            steps {
                sshagent(['aws-ssh-key']) {
                    bat """
                    ssh -o StrictHostKeyChecking=no %AWS_EC2_HOST% ^
                        "cd /home/ubuntu/gatepassproo && ^
                        docker-compose pull && ^
                        docker-compose down && ^
                        docker-compose up -d"
                    """
                }
            }
        }

        stage('Verify Containers on EC2') {
            steps {
                sshagent(['aws-ssh-key']) {
                    bat "ssh %AWS_EC2_HOST% \"docker ps\""
                }
            }
        }

        stage('Cleanup Jenkins Server') {
            steps {
                echo "Cleaning up unused Docker images on Jenkins server..."
                bat "docker system prune -f"
            }
        }
    }
}
