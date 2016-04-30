# Copyright 2013-2015 Pervasive Displays, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at:
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
# express or implied.  See the License for the specific language
# governing permissions and limitations under the License.

import time
import sys
import os
import sys
import termios
import tty
from PIL import Image
from PIL import ImageDraw
from EPD import EPD
from PIL import ImageFont
import textwrap
import sys, json

WHITE = 1
BLACK = 0

inputStr = "type anything and press enter!"


def main(argv):
    """main program - draw and display a test image"""
    #cont = "y"
    #while cont == "y":
    epd = EPD()

    print('panel = {p:s} {w:d} x {h:d}  version={v:s} COG={g:d} FILM={f:d}'.format(p=epd.panel, w=epd.width, h=epd.height, v=epd.version, g=epd.cog, f=epd.film))

    epd.clear()
        

        #while True:
        # ewString = ''
    for line in sys.stdin:
       newString =  line[:-1]
           #ewString = raw_input('your text')
        #if ewString != '':
           #newString = "Please wait...  Tlonating: " + ewString
    demo(epd, newString)
           #time.sleep(20)
           #ewString = ''
           # break


    
    
def demo(epd, str1):
    """simple drawing demo - black drawing on white background"""

    # initially set all white background
    image = Image.new('1', epd.size, WHITE)

    # prepare for drawing
    draw = ImageDraw.Draw(image)

    # find some fonts
    # fonts are in different places on Raspbian/Angstrom so search
    possible_message_fonts = [
        '/usr/share/fonts/truetype/droid/DroidSansFallbackFull.ttf',      # R.Pi
        '/usr/share/fonts/truetype/ttf-dejavu/DejaVuSans.ttf',            # R.Pi
        '/usr/share/fonts/truetype/freefont/FreeMono.ttf',                # R.Pi
        '/usr/share/fonts/truetype/LiberationSans-Regular.ttf',           # B.B
        '/usr/share/fonts/truetype/DejaVuSans.ttf'                        # B.B
        '/usr/share/fonts/TTF/DejaVuSans.ttf'                             # Arch
    ]

    message_font_name = find_font(possible_message_fonts)
    if '' == message_font_name:
        raise 'no message font file found'

    message_font = ImageFont.truetype(message_font_name, 24)

    w, h = image.size
    draw.rectangle((0, 0, w, h), fill=WHITE, outline=WHITE)
    y = 10
    for line in textwrap.wrap(str1, 18):
        draw.text((5, y), line, fill=BLACK, font=message_font)
        y = y + 20

    # display image on the panel
    epd.display(image)
    epd.update()


def find_font(font_list):
    """find a font file from a list of possible paths"""
    for f in font_list:
        if os.path.exists(f):
            return f
    return ''

# main
if "__main__" == __name__:
    if len(sys.argv) < 1:
        sys.exit('usage: {p:s}'.format(p=sys.argv[0]))
    main(sys.argv[1:])


