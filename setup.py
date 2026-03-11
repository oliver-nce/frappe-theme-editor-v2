from setuptools import setup, find_packages

with open("requirements.txt") as f:
    install_requires = f.read().strip().split("\n")

# Get version from __version__ variable in frappe_theme_editor/__init__.py
from frappe_theme_editor import __version__ as version

setup(
    name="frappe_theme_editor",
    version=version,
    description="Visual theme editor for Frappe/ERPNext applications",
    author="NCE",
    author_email="dev@ncesoccer.com",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires,
)
