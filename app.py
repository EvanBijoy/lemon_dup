from flask import Flask, render_template, request, redirect, url_for, jsonify, send_file, make_response
from cryptography.fernet import Fernet
from auth import *
import dbutils
from dbutils import *
from maker import images_to_video
from audiomaker import combine_audios
import json
from pathlib import Path
import os
import moviepy.editor as mp

app = Flask(__name__)

key = Fernet.generate_key()
fernet = Fernet(key)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/home', methods=['POST'])
def home():
    token = request.form['token']
    print(token)
    email = validate_token(token)
    if email is None:
        return 404
    return render_template("home.html")

@app.route('/workspace', methods=['POST'])
def workspace():
    token = request.form['token']
    print(token)
    email = validate_token(token)
    if email is None:
        return 404
    return render_template("workspace.html")

@app.route('/new_token', methods=['POST'])
def new_token():
    email = request.json.get('email')
    password = request.json.get('password')
    auth = dbutils.authenticate(email, password)
    if auth:
        token = generate_token(email)
        return json.dumps({'token': token}), 200
    else:
        # evans code here
        return json.dumps({'Error': 'Error'}), 404

@app.route('/login')
def login():
    return render_template("login.html")
            
@app.route('/admin_login')
def admin_login():
    return render_template("adminlogin.html")

@app.route('/admin_login', methods=['POST'])
def admin_login_post():
    email = request.form['email']
    password = request.form['password']
    auth = dbutils.authenticate_admin(email, password)
    if auth:
        token = generate_token(email)
        return redirect(url_for('admin'))
    else:
        #evans code here
        return json.dumps({'Error': 'Error'}), 404
            
@app.route('/admin')
def admin():
    all_users = users()
    return render_template('admin.html', all_users=all_users)

@app.route('/sign_up')
def signup():
    return render_template("signup.html")

@app.route('/sign_up', methods=['POST'])
def signup_post():
    name = request.form['username']
    email = request.form['email']
    password = request.form['password']
    Path(uploads + f'static/uploads/users/{email}/audios').mkdir(parents=True, exist_ok=True)
    auth = dbutils.add_user(name, password, email)
    if not auth:
        # add code here to create a pop up box that displays if the entered email address already has an account
        return "user already exists"
    else:
        # add code here if u wanna display a successful sign up pop up
        return redirect(url_for('login'))


@app.route('/upload_images', methods=['POST'])
def upload_images():
    # print(request.files)
    token = request.form['token']
    # print(token)
    email = validate_token(token)
    if email is None:
        return 404
    if 'files' not in request.files:
        return 'No file part'
    files = request.files.getlist('files')
    # Do something with the uploaded file (e.g., save it)
    for file in files:
        # print(file.filename)
        Path(uploads + f'static/uploads/users/{email}/images').mkdir(parents=True, exist_ok=True)

        new_name = file.filename

        if dbutils.check_file(email, 'image', new_name):
            i = 1
            new_name = file.filename + '_' + str(i)
            while dbutils.check_file(email, 'image', new_name):
                i += 1
                print(i)
                new_name = file.filename + '_' + str(i)

        file.save(uploads + f'static/uploads/users/{email}/images/{new_name}')
        dbutils.add_file(email, 'image', new_name)
    return 'File uploaded successfully'


@app.route('/delete_image', methods=['POST'])
def delete_image():
    # print(request.files)
    token = request.form['token']
    # print(token)
    email = validate_token(token)
    if email is None:
        return 404
    filename = request.form['file']
    print(filename)
    if os.path.exists(uploads + f"static/uploads/users/{email}/images/{filename}"):
        dbutils.delete_file(email, "image", filename)
        os.remove(uploads + f"static/uploads/users/{email}/images/{filename}")
        return 'file removed'
    else:
        return 'removal failed'

@app.route('/upload_audios', methods=['POST'])
def upload_audio():
    # print(request.files)
    token = request.form['token']
    # print(token)
    email = validate_token(token)
    if email is None:
        return 404
    if 'files' not in request.files:
        return 'No file part'
    files = request.files.getlist('files')
    # Do something with the uploaded file (e.g., save it)
    for file in files:
        # print(file.filename)
        Path(uploads + f'static/uploads/users/{email}/audios').mkdir(parents=True, exist_ok=True)

        new_name = file.filename

        if dbutils.check_file(email, 'audio', new_name):
            i = 1
            new_name = file.filename + '_' + str(i)
            while dbutils.check_file(email, 'audio', new_name):
                i += 1
                print(i)
                new_name = file.filename + '_' + str(i)

        file.save(uploads + f'static/uploads/users/{email}/audios/{new_name}')
        dbutils.add_file(email, 'audio', new_name)
    return 'File uploaded successfully'

@app.route('/delete_audio', methods=['POST'])
def delete_audio():
    token = request.form['token']
    # print(token)
    email = validate_token(token)
    if email is None:
        return 404
    filename = request.form['file']
    print(filename)
    if os.path.exists(uploads + f"static/uploads/users/{email}/audios/{filename}"):
        dbutils.delete_file(email, "audio", filename)
        os.remove(uploads + f"static/uploads/users/{email}/audios/{filename}")
        return 'file removed'
    else:
        return 'removal failed'

@app.route('/get_files', methods=['POST'])
def get_image_files():
    token = request.form['token']
    email = validate_token(token)
    if email is None:
        return 404
    files = {}
    files['images'] = dbutils.list_files(email, 'image')
    files['audios'] = dbutils.list_files(email, 'audio')
    if dbutils.init_timeline is not None:
        files['timeline'] = dbutils.init_timeline(email)
    print(files)
    return jsonify(files)

@app.route('/get_audio_files', methods=['POST'])
def get_audio_files():
    token = request.form['token']
    email = validate_token(token)
    if email is None:
        return 404
    files = dbutils.list_files(email, 'audio')
    return jsonify(files)

@app.route('/get_init_image_files')
def get_init_image_files():
    token = request.form['token']
    email = validate_token(token)
    if email is None:
        return 404
    files = dbutils.init_files(email, 'image')
    return files

@app.route('/get_init_audio_files')
def get_init_audio_files():
    token = request.form['token']
    email = validate_token(token)
    if email is None:
        return 404
    files = dbutils.init_files(email, 'audio')
    return files


@app.route('/workspace/update_timeline', methods=['POST'])
def update_timeline():
    token = request.form['token']
    email = validate_token(token)
    if email is None:
        return 404

    if 'images' not in request.form and 'audios' not in request.form:
        return 'No file part'
    images = request.form['images']
    audios = request.form['audios']

    files = {}

    files["images"] = json.loads(images)
    files["audios"] = json.loads(audios)

    print(files)
    print(json.dumps(files))

    dbutils.update_json_image(email, json.dumps(files))

    image_list = []
    image_durations = []
    image_transitions = []
    audio_list = []
    aud_start_list = []
    aud_end_list = []

    for i in json.loads(images):

        image_path = ""

        name = i["name"]

        if production:
            image_path = f'/home/storage/static/uploads/users/{email}/images/{name}'
        else:
            image_path = f"static/uploads/users/{email}/images/{name}"

        duration = i["duration"]
        transition = i["transition"]

        print(image_path)

        image_list.append(image_path)
        image_durations.append(int(duration))
        image_transitions.append(int(transition))

    for i in json.loads(audios):

        aud_path = ""

        name = i["name"]

        if production:
            aud_path = f'/home/storage/static/uploads/users/{email}/audios/{name}'
        else:
            aud_path = f"static/uploads/users/{email}/audios/{name}"

        starting = i["start"]
        ending = i["end"]

        print(aud_path)

        audio_list.append(aud_path)
        aud_start_list.append(float(starting))
        aud_end_list.append(float(ending))

    print(audio_list)

    if production:
        video_path = f'/home/storage/static/uploads/users/{email}/preview.mp4'
    else:
        video_path = f"static/uploads/users/{email}/preview.mp4"

    if production:
        audio_path = f'/home/storage/static/uploads/users/{email}/outputAudio.mp3'
    else:
        audio_path = f"static/uploads/users/{email}/outputAudio.mp3"

    combine_audios(audio_list, aud_start_list, aud_end_list, audio_path)

    images_to_video(image_list, video_path, image_durations, image_transitions, audio_path, fps=10)

    return "updated timeline"

@app.route('/search_image', methods=['POST'])
def search_image():
    token = request.form['token']
    term = request.form['search']

    email = validate_token(token)
    if email is None:
        return 404
    files = {}
    files['images'] = dbutils.search_file('image', term, email)
    print(files)
    return jsonify(files)

@app.route('/search_audio', methods=['POST'])
def search_audio():
    token = request.form['token']
    term = request.form['search']

    email = validate_token(token)
    if email is None:
        return 404
    files = {}
    files['audios'] = dbutils.search_file('audio', term, email)
    print(files)
    return jsonify(files)

@app.route('/export_video', methods=['POST'])
def download_video():
    token = request.form['token']
    resolution = request.form['resolution']

    print("hello", resolution)

    email = validate_token(token)
    if email is None:
        return 404

    if production:
        video_path = f'/home/storage/static/uploads/users/{email}/preview.mp4'
    else:
        video_path = f"static/uploads/users/{email}/preview.mp4"

    clip = mp.VideoFileClip(video_path)
    clip_resized = None
    if resolution == '1':
        clip_resized = clip.resize(height=1080) 
    if resolution == '2':
        clip_resized = clip.resize(height=720) 
    if resolution == '3':
        clip_resized = clip.resize(height=360)

    if production:
        clip_resized.write_videofile(f'/home/storage/static/uploads/users/{email}/export.mp4')
    else:
        clip_resized.write_videofile(f'static/uploads/users/{email}/export.mp4')

    response = make_response(send_file(f"static/uploads/users/{email}/export.mp4"))

    return response

if __name__ == "__main__":
    app.run(debug=True)


@app.route('/static/uploads/users/<email>/<filetype>/<filename>')
def redirect_user_images(email, filetype, filename):

    print(email, filetype, filename)

    response = ""

    # Construct the new URL path
    if production:
        new_url = f'/home/storage/static/uploads/users/{email}/{filetype}/{filename}'
        print(new_url)
        response = make_response(send_file(new_url))
    else:
    #return send_file(f"static/uploads/users/{email}/{filetype}/{filename}", cache_timeout=3600, conditional=True)
        response = make_response(send_file(f"static/uploads/users/{email}/{filetype}/{filename}"))
    
    # Set cache control headers
    response.headers['Cache-Control'] = 'public, max-age=3600'  # Cache for 1 hour
    
    return response
