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
        withCredentials([usernamePassword(credentialsId: 'dockerhub-cred', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
            bat """
            set DOCKER_CONFIG=C:\\Temp\\docker-config
            echo %DOCKER_PASS% | "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" login -u %DOCKER_USER% --password-stdin
            """
        }
    }
}



        stage('Build Docker Images') {
    steps {
        bat """
        set DOCKER_CONFIG=C:\\Temp\\docker-config
        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" compose build
        """
    }
}


        stage('Push to Docker Hub') {
    steps {
        bat """
        set DOCKER_CONFIG=C:\\Temp\\docker-config
        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" push kavinath/gatepass-backend:latest
        "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" push kavinath/gatepass-frontend:latest
        """
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
