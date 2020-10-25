

## setup
install node on raspberry pi

Enable i2c

https://www.raspberrypi.org/documentation/hardware/display/troubleshooting.md


sudo apt-get install xscreensaver

### /home/pi/.config/lxsession/LXDE-pi/autostart
```
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
@xscreensaver -no-splash
@xset s off
@xset -dpms
@xset s noblank
@point-rpi
@/home/pi/jarvis/run.sh
```

### make sure we can turn off the screen
```
sudo chmod 777 /sys/class/backlight/rpi_backlight/bl_power
```
