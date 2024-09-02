import os
from pydub import AudioSegment

def combine_audios(audio_list, start, end, output_file):
    # Initialize an empty AudioSegment object
    combined_audio = AudioSegment.silent(duration=0)

    print(audio_list)
    
    # Iterate over the audio files and their durations
    for idx, audio_file in enumerate(audio_list):
        audio = AudioSegment.from_file(audio_file)
        starting = start[idx]
        ending = end[idx]
        combined_audio += audio[int(starting * 1000):int(ending * 1000)]  # Convert duration from seconds to milliseconds
        
    # Export the combined audio
    combined_audio.export(output_file, format="mp3")
    print("Combined audio saved successfully!")

# # Example usage:
# input_folder = "static/audio"
# start = [2, 5, 20]  # Duration of each audio clip in seconds (if available)
# end = [4, 10, 13]
# output_file = "combined_audio.mp3"

# combine_audios(input_folder, start, end, output_file)