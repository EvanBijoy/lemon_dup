#!/bin/bash

# Ensure we're in the correct directory
# cd $DEPLOYMENT_TARGET

# Create a virtual environment if needed
# python3 -m venv ~/myenv
# source ~/myenv/bin/activate

# Install Python dependencies
# pip install -r requirements.txt

# Deactivate the virtual environment
# deactivate

# Move or copy application files to /home directory
# echo "Moving application files to /home directory..."
# mv * /home/site/wwwroot/  # or cp -r * /home/site/wwwroot/

# Restart the application (optional)
# echo "Restarting Flask application..."
# cd /home/site/wwwroot
# gunicorn -w 4 -b 0.0.0.0:$PORT app:app

